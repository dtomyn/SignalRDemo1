using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;

namespace WebApplication1
{
    [HubName("hitCounter")]
    public class HitcounterHub : Hub
    {
        private static int _hitCount;
        public void RecordHit()
        {
            _hitCount += 1;
            //note... this is a dynamic method... think of the method as an event
            Clients.All.updateHitCount(_hitCount);
            //when this event fires on the server there is going to be a JavaScript event that will fire
            //"All" means All callers will see the response
            // also get "Caller"... only for the specific caller not everyone sees it
            // also get "Groups"... only a private connection
        }

        public override Task OnDisconnected()
        {
            /* when you close the web browser then THIS will call it!!!! wow!! */
            _hitCount -= 1;
            Clients.All.updateHitCount(_hitCount);
            return base.OnDisconnected();
        }
    }
}