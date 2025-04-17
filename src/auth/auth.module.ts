import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/core/user/user.module';

@Module({
    imports: [UserModule],
    exports: [UserModule]
})
export class AuthModule {}
