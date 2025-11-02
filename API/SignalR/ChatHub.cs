using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Messages;
using Application.User;
using Domain;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using SQLitePCL;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private IMediator _mediator;
        private UserManager<AppUser> _userManager;
        private DataContext _context;
        private IUserAccessor _userAccessor;

        public ChatHub(IMediator mediator, UserManager<AppUser> userManager, DataContext context, IUserAccessor userAccessor)
        {
            _mediator = mediator;
            _userManager = userManager;
            _context = context;
            _userAccessor = userAccessor;
        }
        public async Task SendMessage(Create.Command command)
        {
            var message = await _mediator.Send(command);
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
        public async Task Login(Login.Query query)
        {
            var user = await _userManager.FindByEmailAsync(query.Email);
            var userToReturn = new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Id = user.Id,
                IsOnline = true,
                Avatar = user.Avatar
            };
            await Clients.All.SendAsync("UserLogged", userToReturn);
        }
        public async Task Logout(string query)
        {
            var user = await _context.Users.FindAsync(query);
            var userToReturn = new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Id = user.Id,
                IsOnline = false,
                Avatar = user.Avatar
            };
            await Clients.All.SendAsync("UserLogout", userToReturn);
        }

        public async Task StartTyping(Create.Command command)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());
            var typingToReturn = new TypingNotification
            {
                Sender = user,
                ChannelId = command.ChannelId
            };
            await Clients.All.SendAsync("UserStartTyping", typingToReturn);
        }

        public async Task StopTyping(Create.Command command)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());
            var typingToReturn = new TypingNotification
            {
                Sender = user,
                ChannelId = command.ChannelId
            };
            await Clients.All.SendAsync("UserStopTyping", typingToReturn);
        }
    }
}