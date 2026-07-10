namespace LinkVault.Application.Interfaces;

public interface IQrCodeService
{
    byte[] GenerateQrCode(string content, int size = 256);
    string GenerateQrCodeBase64(string content, int size = 256);
}
