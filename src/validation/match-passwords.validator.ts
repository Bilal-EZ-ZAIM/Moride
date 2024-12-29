import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswordsValidator implements ValidatorConstraintInterface {
  validate(confirmepassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return confirmepassword === object.password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Confirm password must match the password.';
  }
}
