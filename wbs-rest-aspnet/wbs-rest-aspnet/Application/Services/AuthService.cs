using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.Persistence.Models;
using wbs_rest_aspnet.Application.Dtos.Responses;
using wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;
using wbs_rest_aspnet.Application.Services.Interfaces;

namespace wbs_rest_aspnet.Application.Services;

public class AuthService : IAuthService
{
    private WbsContext context;
    private IConfiguration config;

    public AuthService(WbsContext context, IConfiguration config)
    {
        this.context = context;
        this.config = config;
    }

    public LoginResultDto Signin(LoginDto input)
    {
        var user = context.Users.FirstOrDefault(user => user.Email.ToLower() == input.Email.ToLower());

        if (user == null)
        {
            return new LoginResultDto
            {
                Success = false,
                Message = "Invalid credentials"
            };
        }

        var passwordHash = HashUsingPbkdf2(input.Password, Convert.FromBase64String(user.PasswordSalt));

        if (user.PasswordHash != passwordHash)
        {
            return new LoginResultDto
            {
                Success = false,
                Message = "Invalid credentials"
            };
        }

        var accessToken = GenerateAccessToken(user.UserId);

        var refreshToken = GenerateRefreshToken();

        return new LoginResultDto
        {
            Success = true,
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public SignupResultDto Signup(SignupDto input)
    {
        User? user1 = context.Users.FirstOrDefault(user => user.Email == input.Email);

        if (user1 != null)
        {
            return new SignupResultDto
            {
                Success = false,
                AccessToken = null,
                RefreshToken = null,
                Message = "Email already in use."
            };
        }

        var salt = GetSecureSalt();

        var passwordHash = HashUsingPbkdf2(input.Password, salt);

        var passwordSalt = Convert.ToBase64String(salt);

        var user = new User
        {
            Name = input.Name,
            Email = input.Email,
            Surname = input.Surname,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt
        };

        context.Users.Add(user);

        context.SaveChanges();

        var accessToken = GenerateAccessToken(user.UserId);

        var refreshToken = GenerateRefreshToken();

        // salt = GetSecureSalt();

        // var refreshedTokenHashed = HashUsingPbkdf2(refreshToken, salt);

        return new SignupResultDto
        {
            Success = true,
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public RefreshResultDto Refresh(RefreshDto input)
    {
        // var refreshToken = await tasksDbContext.RefreshTokens.FirstOrDefaultAsync(o => o.UserId == refreshTokenRequest.UserId);

        // var response = new ValidateRefreshTokenResponse();
        // if (refreshToken == null)
        // {
        //     response.Success = false;
        //     response.Error = "Invalid session or user is already logged out";
        //     response.ErrorCode = "R02";
        //     return response;
        // }

        // var refreshTokenToValidateHash = PasswordHelper.HashUsingPbkdf2(refreshTokenRequest.RefreshToken, Convert.FromBase64String(refreshToken.TokenSalt));

        // if (refreshToken.TokenHash != refreshTokenToValidateHash)
        // {
        //     response.Success = false;
        //     response.Error = "Invalid refresh token";
        //     response.ErrorCode = "R03";
        //     return response;
        // }

        // if (refreshToken.ExpiryDate < DateTime.Now)
        // {
        //     response.Success = false;
        //     response.Error = "Refresh token has expired";
        //     response.ErrorCode = "R04";
        //     return response;
        // }

        // response.Success = true;
        // response.UserId = refreshToken.UserId;

        // return response;
        return new RefreshResultDto
        {

        };
    }

    public string GenerateAccessToken(int userId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Convert.FromBase64String(config["Jwt:Key"]);

        var claimsIdentity = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            });

        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = claimsIdentity,
            // Issuer = Issuer,
            // Audience = Audience,
            Expires = DateTime.Now.AddMinutes(int.Parse(config["Jwt:TokenValidityInMinutes"])),
            SigningCredentials = signingCredentials,

        };

        var securityToken = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(securityToken);
    }
    public string GenerateRefreshToken()
    {
        var secureRandomBytes = new byte[32];

        using var randomNumberGenerator = RandomNumberGenerator.Create();

        randomNumberGenerator.GetBytes(secureRandomBytes);

        var refreshToken = Convert.ToBase64String(secureRandomBytes);

        return refreshToken;
    }

    public string HashUsingPbkdf2(string password, byte[] salt)
    {
        byte[] derivedKey = KeyDerivation.Pbkdf2
        (password, salt, KeyDerivationPrf.HMACSHA256, iterationCount: 100000, 32);

        return Convert.ToBase64String(derivedKey);
    }

    public byte[] GetSecureSalt()
    {
        return RandomNumberGenerator.GetBytes(32);
    }
}