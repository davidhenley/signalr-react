using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalRReact
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string username, string message)
        {
            await Clients.All.SendAsync("UpdateMessages", username, message);
        }
    }
}