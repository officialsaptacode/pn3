import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { BadRequestException } from "@nestjs/common";

/**
 * Guards against SSRF: the server fetches a CSV URL that the caller supplies,
 * so it must never be allowed to reach loopback, private or link-local hosts
 * (cloud metadata endpoints, internal services, ...).
 */

const MAX_REDIRECTS = 3;

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc * 256 + Number(octet)) >>> 0, 0);
}

function inIpv4Range(ip: string, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

function isPrivateIpv4(ip: string): boolean {
  return (
    inIpv4Range(ip, "0.0.0.0", 8) ||
    inIpv4Range(ip, "10.0.0.0", 8) ||
    inIpv4Range(ip, "100.64.0.0", 10) ||
    inIpv4Range(ip, "127.0.0.0", 8) ||
    inIpv4Range(ip, "169.254.0.0", 16) ||
    inIpv4Range(ip, "172.16.0.0", 12) ||
    inIpv4Range(ip, "192.0.0.0", 24) ||
    inIpv4Range(ip, "192.0.2.0", 24) ||
    inIpv4Range(ip, "192.168.0.0", 16) ||
    inIpv4Range(ip, "198.18.0.0", 15) ||
    inIpv4Range(ip, "198.51.100.0", 24) ||
    inIpv4Range(ip, "203.0.113.0", 24) ||
    inIpv4Range(ip, "224.0.0.0", 4) ||
    inIpv4Range(ip, "240.0.0.0", 4)
  );
}

function isPrivateIpv6(ip: string): boolean {
  const value = ip.toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
  if (value === "::" || value === "::1") return true;

  // IPv4-mapped (::ffff:127.0.0.1) inherits the IPv4 rules.
  const mapped = value.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIpv4(mapped[1]);

  if (/^f[cd]/.test(value)) return true; // unique local fc00::/7
  if (/^fe[89ab]/.test(value)) return true; // link local fe80::/10
  if (value.startsWith("ff")) return true; // multicast
  return false;
}

function isPrivateAddress(ip: string): boolean {
  const family = isIP(ip);
  if (family === 4) return isPrivateIpv4(ip);
  if (family === 6) return isPrivateIpv6(ip);
  return true;
}

/**
 * Validates that a caller-supplied URL points at a public host and returns it.
 * Throws BadRequestException when the URL is malformed or resolves to a
 * private/reserved address.
 */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new BadRequestException("csvUrl must be a valid absolute URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new BadRequestException("csvUrl must use http or https");
  }

  const host = url.hostname;
  if (isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new BadRequestException("csvUrl must not point to a private address");
    }
    return url;
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(host, { all: true });
  } catch {
    throw new BadRequestException("csvUrl host could not be resolved");
  }

  if (addresses.length === 0) {
    throw new BadRequestException("csvUrl host could not be resolved");
  }

  for (const { address } of addresses) {
    if (isPrivateAddress(address)) {
      throw new BadRequestException("csvUrl must not point to a private address");
    }
  }

  return url;
}

/**
 * Fetches a caller-supplied URL, re-validating every redirect target so a
 * public URL cannot bounce the server onto an internal address.
 */
export async function fetchPublicUrl(rawUrl: string): Promise<Response> {
  let target = await assertPublicUrl(rawUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(target, { redirect: "manual" });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return response;
      target = await assertPublicUrl(new URL(location, target).toString());
      continue;
    }

    return response;
  }

  throw new BadRequestException("Too many redirects while fetching csvUrl");
}
