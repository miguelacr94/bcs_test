import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Miguel Contreras',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  readonly name!: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'miguel@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico provisto no tiene un formato válido.' })
  readonly email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  readonly password!: string;
}
