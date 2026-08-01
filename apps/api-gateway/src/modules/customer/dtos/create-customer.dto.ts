import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Juan' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name!: string;

  @ApiProperty({ example: 'Perez' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName!: string;

  @ApiProperty({ example: '123456789' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @Length(5, 20, { message: 'El documento debe tener entre 5 y 20 caracteres' })
  document!: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({ example: '+573001234567' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  phone!: string;
}
