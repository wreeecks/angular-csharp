using System;
using System.Threading.Tasks;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly IUserRepository _userRepository;

        public LogUserActivity(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();
            var user = await _userRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.Now;
            _userRepository.Update(user);
            await _userRepository.SaveAllAsync();
            
        }
    }
}