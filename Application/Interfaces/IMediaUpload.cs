using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.MediaUpload;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IMediaUpload
    {
        MediaUploadResult UploadMedia(IFormFile file);
    }
}