using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using SQLitePCL;
using Application.Channels;
using System.Threading;
using Microsoft.AspNetCore.Authorization;

#nullable enable
namespace API.Controllers
{
    public class ChannelsController : BaseController
    {
    
        [HttpGet]
        public async Task<ActionResult<List<Channel>>> List([FromQuery] List.Query query)
        { 
            Console.WriteLine($"Received ChannelType: {query.ChannelType}");
            return await Mediator.Send(query);
        }

        [HttpPut("details/{id}")]

        /*[Authorize]
        no es necesario si aplico una politica para requerir user authenticado en los controladores desde el startup.cs, ahora si quiero que 
        un endpoint particular se pueda usar sin autorizacion puedo usar el verbo [AllowAnonymous]*/
        public async Task<ActionResult<ChannelDto>> Details (Guid id, [FromBody] Message? message = null)
        {
            return await Mediator.Send(new Details.Query { Id = id, LastMessage=message });
        } 

        [HttpPost]
        public async Task<Unit> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("private/{id}")]
        public async Task<ActionResult<ChannelDto>> PrivateDetails(string id) 
        {
            return await Mediator.Send(new PrivateChannelDatails.Query{ UserId = id });
        }

        [HttpPut("{id}")]
        public async Task<Unit> Edit(Guid id, [FromBody] Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }
    }
}