using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using SQLitePCL;

namespace Application.User
{
    public class List
    {
        public class Query : IRequest<List<UserDto>> {

        }

        public class Handler : IRequestHandler<Query, List<UserDto>>
        {
            private DataContext _context;
            private IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<List<UserDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var users = await _context.Users.ToListAsync();
                var userToReturn = _mapper.Map<IEnumerable<AppUser>, List<UserDto>>(users);
                return userToReturn; 
            }
        }
  }
}