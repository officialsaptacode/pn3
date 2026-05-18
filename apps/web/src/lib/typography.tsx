import { cn } from "@workspace/ui/lib/utils";
import { manrope, raleway } from "./fonts";

export function TypographyH1({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h1
      className={cn(
        `text-[clamp(3rem,1.2105rem+3.9474vw,5rem)] ${raleway.className}`, //80px
        className,
      )}
      {...props}
    />
  );
}

export function TypographyH2({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h2
      className={cn(
        `text-[clamp(2.25rem,1.9868rem+1.3158vw,3.25rem)] ${raleway.className} tracking-tight first:mt-0`, //52px
        className,
      )}
      {...props}
    />
  );
}

export function TypographyH3({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h3
      className={cn(
        `text-[clamp(1.5rem,1.3026rem+0.9868vw,2.25rem)] ${raleway.className} tracking-tight`, //36px
        className,
      )}
      {...props}
    />
  );
}

export function TypographyH4({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <div className={cn(`text-2xl ${raleway.className} tracking-tight`, className)} {...props} />
  );
}
export function TypographyH5({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <div className={cn(`text-xl ${raleway.className} tracking-tight`, className)} {...props} />
  );
}

export function TypographyP({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p
      className={cn(
        `text-base md:text-xl ${manrope.className} leading-none tracking-tight`,
        className,
      )}
      {...props}
    />
  );
}

export function TypographyBlockquote({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLQuoteElement>>) {
  return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />;
}

export function TypographyList({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>>) {
  return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />;
}

export function TypographyInlineCode({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function TypographyLead({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn(`text-xl ${manrope.className} leading-none`, className)} {...props} />;
}

export function TypographyLarge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <div className={cn("text-lg font-semibold", manrope.className, className)} {...props} />;
}

export function TypographyBase({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn("text-base leading-none", manrope.className, className)} {...props} />;
}

export function TypographySmall({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <small className={cn(`text-sm ${manrope.className} leading-none`, className)} {...props} />
  );
}

export function TypographyMuted({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

interface ColorFulLineProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  initialWidth: number | string;
  hoverWidth: number | string;
}

export function ColorHr({ color, initialWidth, hoverWidth, className }: ColorFulLineProps) {
  return (
    <span className="flex flex-row items-center justify-center">
      <hr
        className={cn(
          `${color} h-[2px] border-none bg-orange-300 w-[${initialWidth}%] group-hover:w-[${hoverWidth}%]`,
          className,
        )}
      />
    </span>
  );
}
