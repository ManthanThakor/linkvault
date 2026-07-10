using LinkVault.Application.Interfaces;
using QRCoder;

namespace LinkVault.Application.Services;

public class QrCodeService : IQrCodeService
{
    public byte[] GenerateQrCode(string content, int size = 256)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        return qrCode.GetGraphic(size);
    }

    public string GenerateQrCodeBase64(string content, int size = 256)
    {
        var bytes = GenerateQrCode(content, size);
        return $"data:image/png;base64,{Convert.ToBase64String(bytes)}";
    }
}
