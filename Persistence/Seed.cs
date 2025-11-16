using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any()){
                var users = new List<AppUser>{
                    new AppUser{
                        Id= "1",
                        UserName= "Rodrigo",
                        Email="rodrigo@test.com"
                    }
                };

                foreach(var user in users){
                    await userManager.CreateAsync(user, "Test123@");
                }
            }

        }
    }
}