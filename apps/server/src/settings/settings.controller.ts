import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Public, Roles } from "@/auth/decorator";
import { AtGuard, RolesGuard } from "@/auth/guard";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles("ADMIN")
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Public()
  @Get(":key")
  findOne(@Param("key") key: string) {
    return this.settingsService.findOne(key);
  }

  @Patch(":key")
  @UseGuards(AtGuard, RolesGuard)
  @Roles("ADMIN")
  update(@Param("key") key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(key, updateSettingDto);
  }

  @Delete(":key")
  @UseGuards(AtGuard, RolesGuard)
  @Roles("ADMIN")
  remove(@Param("key") key: string) {
    return this.settingsService.remove(key);
  }
}
