import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserDetailsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userName: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{
      message: 'password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and '+
      'one special character'
    })
    password: string;
}
