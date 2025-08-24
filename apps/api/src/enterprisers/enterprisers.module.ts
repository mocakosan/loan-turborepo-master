import { Module } from '@nestjs/common';
import { EnterprisersService } from './enterprisers.service';
import { EnterprisersController } from './enterprisers.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SendmModule } from 'src/sendm/sendm.module';

@Module({
  imports: [SendmModule],
  providers: [EnterprisersService, SupabaseService],
  exports: [EnterprisersService],
  controllers: [EnterprisersController],
})
export class EnterprisersModule {}
