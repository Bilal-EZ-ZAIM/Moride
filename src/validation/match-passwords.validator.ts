import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchPasswordsValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const object = args.object as any;
    return password === object.confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Les mots de passe ne correspondent pas.'; 
  }
}
