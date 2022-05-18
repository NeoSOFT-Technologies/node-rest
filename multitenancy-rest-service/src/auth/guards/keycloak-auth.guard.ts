import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { PublicKeyCache } from '../cache.publicKey';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(
    private readonly authenticationService: AuthService,
    private publicKeyCache: PublicKeyCache,
    private reflector: Reflector,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const header = request.header('Authorization');
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = parts[1];
    try {
      const publicKey = await this.publicKeyCache.getPublicKey(token);
      await this.authenticationService.validateTokenwithKey(token, publicKey);

      let usrRole: boolean = true, usrPermission: boolean = true;
      if (roles) {
        const userRoles: string[] = await this.authenticationService.getRoles(token);
        if (!userRoles) {
          return false;
        }
        usrRole = await this.hasRole(userRoles, roles);
      }
      if (permissions) {
        const userPermissions: string[] = await this.authenticationService.getPermissions(token);
        if (!userPermissions) {
          return false;
        }
        usrPermission = await this.hasPermission(userPermissions, permissions);
      }
      return usrRole && usrPermission;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }

  async hasRole(userRoles: string[], roles: string[]): Promise<boolean> {
    const containsAny: boolean = roles.some(role => {
      return userRoles.includes(role);
    })
    return containsAny;
  }

  async hasPermission(userPermissions: string[], permissions: string[]): Promise<boolean> {
    const containsAny: boolean = permissions.some(permission => {
      return userPermissions.includes(permission);
    })
    return containsAny;
  }

}