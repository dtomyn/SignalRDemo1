using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;

namespace WebApplication1.Hubs
{
    public class TrackerConnection : PersistentConnection
    {

        public static void InitRoute()
        {
            RouteTable.Routes.MapConnection<TrackerConnection>(
                name: "tracker",
                url: "/tracker");
        }

        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {
            return Connection.Broadcast(data);
        }
    }
}