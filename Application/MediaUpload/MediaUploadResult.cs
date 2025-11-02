using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Application.MediaUpload
{
    public class MediaUploadResult
    {
        public string PublicId {get; set;}
        public string Url {get; set; }

    }
}