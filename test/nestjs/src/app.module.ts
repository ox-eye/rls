import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RLSModule } from 'lib/rls.module';
import { getTypeOrmConfig } from 'test/util/test-utils';
import { ConnectionOptions } from 'typeorm';
import { Request } from 'express';
import { Post } from 'test/util/entity/Post';
import { Category } from 'test/util/entity/Category';

const configs = getTypeOrmConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...configs[0],
      username: 'tenant_aware_user',
      entities: [Post, Category],
      logging: true,
    } as ConnectionOptions),
    RLSModule.forRoot([], (req: Request) => {
      const tenantId = req.headers['tenant_id'] as string;
      const actorId = req.headers['actor_id'] as string;

      return {
        actorId,
        tenantId,
      };
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...RLSModule.forFeature([Post, Category])],
})
export class AppModule {}
