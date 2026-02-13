import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserResponse, UserRole } from '@ahatutor/shared';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class UserService {
  private users = new Map<string, User>();
  private refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();

  constructor(private readonly jwtService: JwtService) {
    this.seedAdminUser();
  }

  private seedAdminUser() {
    const adminId = 'admin-default';
    if (!this.users.has(adminId)) {
      this.users.set(adminId, {
        id: adminId,
        username: 'admin',
        email: 'admin@ahatutor.com',
        password: bcrypt.hashSync('admin123', 10),
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });
    }
  }

  async register(dto: RegisterDto): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    const existingUser = Array.from(this.users.values()).find(
      (u) => u.username === dto.username || u.email === dto.email,
    );

    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: User = {
      id,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    this.users.set(id, user);

    const tokens = await this.generateTokens(user);
    return {
      user: this.toUserResponse(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    const user = Array.from(this.users.values()).find(
      (u) => u.username === dto.username && u.isActive,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    this.users.set(user.id, user);

    const tokens = await this.generateTokens(user);
    return {
      user: this.toUserResponse(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenData = this.refreshTokens.get(refreshToken);

    if (!tokenData || tokenData.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = this.users.get(tokenData.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    this.refreshTokens.delete(refreshToken);
    return this.generateTokens(user);
  }

  async validateUser(userId: string): Promise<UserResponse> {
    const user = this.users.get(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return this.toUserResponse(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = this.users.get(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = new Date();
    this.users.set(userId, user);
  }

  async getUserById(userId: string): Promise<UserResponse> {
    const user = this.users.get(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toUserResponse(user);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      isActive: user.isActive,
    };
  }
}
