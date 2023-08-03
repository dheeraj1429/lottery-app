import {
   Body,
   Controller,
   Get,
   Patch,
   Query,
   Res,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import {
   AccountConfigDto,
   AccountConfigUpdateDto,
} from './dtos/account-config.dto';
import { AccountConfigService } from './account-config.service';

@UseGuards(JwtGuard)
@Controller('account-config')
export class AccountConfigController {
   constructor(private readonly accountConfigService: AccountConfigService) {}

   @Get()
   async getAccountConfig(@Query() query: AccountConfigDto, @Res() res) {
      return this.accountConfigService.getAccountConfig(query, res);
   }

   @Patch('/update-config')
   async updateUserAccountConfig(
      @Body() body: AccountConfigUpdateDto,
      @Res() res,
   ) {
      return this.accountConfigService.updateUserAccountConfig(body, res);
   }
}
