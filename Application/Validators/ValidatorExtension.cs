using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtension
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6)
                .WithMessage("Password must be al least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain 1 upper case letter")
                .Matches("[a-z]").WithMessage("Password must contain 1 lower case letter")
                .Matches("[0-9]").WithMessage("Password must contain a number")
                .Matches("[^a-zA-Z-0-9]").WithMessage("Password must containt 1 non alphanumeric character");
                
            return options;
        }
    }
}