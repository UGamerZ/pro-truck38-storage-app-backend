import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductsAudit1700000000000 } from './migrations/1700000000000-CreateProductsAudit';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'pg-22a638cc-gasterdreemyr-af30.k.aivencloud.com',
    port: 25185,
    username: 'avnadmin',
    password: 'AVNS_r46zcBn76tWZRgjVozh',
    database: 'defaultdb',
    entities: [Product],
    synchronize: true,
    autoLoadEntities: true,
    migrations: [CreateProductsAudit1700000000000],
    migrationsRun: true,
    ssl: {
        ca: `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUNZcpoPOJCGbgeoDLNjexv/DTKYYwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNjc1ZjAyYjktZjlkYS00MzBmLWE5M2EtM2U4NmI2ODdh
MzU3IFByb2plY3QgQ0EwHhcNMjYwNDA4MTUwMTEwWhcNMzYwNDA1MTUwMTEwWjA6
MTgwNgYDVQQDDC82NzVmMDJiOS1mOWRhLTQzMGYtYTkzYS0zZTg2YjY4N2EzNTcg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAM/NbPiL
Fvc1I7OntzDhXnRdllqXLv1FwIFhLVLaKHWSVVockPIU4oMOwx27rl34mnSLKt8+
YMOh3Z+EwRebtsooY/FiPPGg9T5sQ/Kqy6WOZJzRTb9UBkNgwfCueo599MASAysw
I6ScPdd/MmheuEJRGTKldvTyC/xBKmRuDI6E//oDp6k6tDjNsidwjls+7/xrpU0d
y8aCpLUTsUQFR8Ys1QBQYjmKnePfn5DFu2qptVDoMW+X+BkcKKRMj/ZM31DRMRYs
EZfR0Mu7QKdu2xddlE0ha6bBBaIcMW0/qQ8Ds8gAtuM4mSWTZVaH9T8s/QE/Ubz1
iSt1Vc6pAXTsjrQvESp8C1ZNziBGRHOU2+8Yo6E+dZvqzqbBXRG2tWk4S91klFWy
o3Ob069rlG840uH/MlbelosBDipzl2H/K4E+EHoZ8MiVuwR06JaEdBze9fXloqtY
dHNQHzHZPaxudgDJuCT3EG2HZDNl4VGfMuk6RuR29oQ48AwWkL0KbQbsxQIDAQAB
o0IwQDAdBgNVHQ4EFgQUNueNKppqmuIaFAJqsM8ljcnBYAgwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAIXsIY0znMqF
z5f/QtwRIfIH8R5V5lHj9ea56fVJ917tmTxIugPFg8zqvysh4h/lKPXJlGP7YMHc
QvzgIfE0jNIos1Phuo8D9APs+oxZONoY4YE+b8CN56xmENXYEjnYZi0L/yq5Qbhe
MjQCvJ3arPtBScy7gZJWKTr8hQnBGlfY5M5K7nn+u3uphcwJQpk7c+8YlAmZVooT
U3enDVvm5xrX2qSQXCzjuMxePNVbF7C6h+V49ZCnRWWBPfJO2W6kXqVo8Ho+x485
dOdkQUEJbNO6bRv5bwozwZ3cemUneP+V2bdH4+5yb8DMoLe8ge/Pp3wgA0pBCdU8
/hbjSkC8shaDj0hB7Odp13z7lR7VYJWH6r3x5HCKVA75nXNJ7Ly9BjgUCejJKPlt
BZpbvidDZ5oPIIAsoRsC91/tNQ+lj/yE9LJs9okn1BuvzqRTdhcHyqwUZ7E8uEGr
KU3t/a/Zh8piOaUpwPqhPYywj5uErWbCUlwatO4GXonXM+O0I9IpDA==
-----END CERTIFICATE-----
        `
    },
};
