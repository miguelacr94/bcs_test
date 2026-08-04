import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password) return false;
    // Validar: al menos 1 mayúscula, 1 minúscula y 1 número.
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
