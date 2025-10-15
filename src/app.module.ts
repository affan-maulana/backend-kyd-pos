import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';

// import MODULE
import { AuthModule } from '@module/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { BusinessModule } from '@module/business/business.module';
import { BusinessTypeModule } from '@module/business-type/business-type.module';
import { StaffModule } from '@module/staff/staff.module';
import { GratuityModule } from '@module/gratuity/gratuity.module';
import { ProductCategoriesModule } from '@module/product-category/product-category.module';
import { SalesTypeModule } from './module/sales-type/sales-type.module';
import { OutletModule } from '@module/outlet/outlet.module';
import { ProductModule } from './module/product/product.module';
import { ProductVariantModule } from './module/product-variant/product-variant.module';
import { AddOnModule } from '@module/add-on/add-on.module';
import { BundleModule } from '@module/bundle/bundle.module';
import { DiscountModule } from '@module/discount/discount.module';
import { PaymentMethodModule } from '@module/payment-method/payment-method.module';
import { TaxModule } from '@module/tax/tax.module';
import { UserModule } from './module/user/user.module';
import { ProductVariantFavoriteModule } from './module/product-variant-favorite/product-variant-favorite.module';

//UTILS

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST_DB'),
        port: configService.get<number>('PORT_DB'),
        username: configService.get<string>('USERNAME_DB'),
        password: configService.get<string>('PASSWORD_DB'),
        database: configService.get<string>('NAME_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    AuthModule,
    PassportModule,
    BusinessModule,
    BusinessTypeModule,
    StaffModule,
    GratuityModule,
    ProductCategoriesModule,
    SalesTypeModule,
    OutletModule,
    // OrderModule,
    ProductModule,
    ProductVariantModule,
    AddOnModule,
    BundleModule,
    DiscountModule,
    PaymentMethodModule,
    TaxModule,
    UserModule,
    ProductVariantFavoriteModule,
  ],
  controllers: [AppController],
  providers: [JwtService],
})
export class AppModule {}
