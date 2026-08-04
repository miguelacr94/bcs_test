import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario registrado',
    example: 'miguel@example.com',
  })
  @IsEmail(
    {},
    { message: 'El correo electrónico provisto no tiene un formato válido.' },
  )
  readonly email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'mc12345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  readonly password!: string;
}
