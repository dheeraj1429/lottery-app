import {
   Body,
   Controller,
   Get,
   Patch,
   Post,
   Query,
   Res,
   UseGuards,
} from '@nestjs/common';
import {
   AccountDto,
   NewAccountDto,
   UpdateAccountDto,
   UserAccountGetDto,
   updateAccountPasswordDto,
} from './dtos/accounts.dtos';
import { AccountsService } from './accounts.service';
import { JwtGuard } from 'src/guards/jwt.guard';

UseGuards(JwtGuard);
@Controller('accounts')
export class AccountsController {
   constructor(private readonly accountService: AccountsService) {}

   @Get('/all-account')
   async getAllAccounts(@Query() query: AccountDto, @Res() res) {
      return this.accountService.getAllAccount(query, res);
   }

   @Post('/create-new-account')
   async createNewAccount(@Body() body: NewAccountDto, @Res() res) {
      return this.accountService.createNewAccount(body, res);
   }

   @Get('/get-single-account-info')
   async getSingleAccountInfo(@Query() query: UserAccountGetDto, @Res() res) {
      return this.accountService.getSingleAccountInfo(query, res);
   }

   @Patch('/update-user-account')
   async updateAccount(@Body() body: UpdateAccountDto, @Res() res) {
      return this.accountService.updateAccount(body, res);
   }

   @Patch('/update-account-password')
   async updateAccountPassword(
      @Body() body: updateAccountPasswordDto,
      @Res() res,
   ) {
      return this.accountService.updateAccountPassword(body, res);
   }
}
