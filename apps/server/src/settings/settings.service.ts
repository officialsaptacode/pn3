import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSettingDto: CreateSettingDto) {
    return this.prisma.setting.upsert({
      where: { key: createSettingDto.key },
      update: { value: createSettingDto.value },
      create: createSettingDto,
    });
  }

  async findAll() {
    return this.prisma.setting.findMany();
  }

  async findOne(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto) {
    try {
      return await this.prisma.setting.update({
        where: { key },
        data: updateSettingDto,
      });
    } catch (_error) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
  }

  async remove(key: string) {
    try {
      return await this.prisma.setting.delete({
        where: { key },
      });
    } catch (_error) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
  }
}
