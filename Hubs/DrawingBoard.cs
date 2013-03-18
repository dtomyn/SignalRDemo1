using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;

namespace WebApplication1
{
    public class DrawingBoard : Hub
    {
        public Task BroadcastPoint(float x, float y)
        {
            return Clients.Others.drawPoint(x, y, Clients.Caller.color);
        }
        public Task BroadcastClear()
        {
            return Clients.Others.clear();
        }
    }

}