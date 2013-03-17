using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;

namespace WebApplication1
{
//attribute sets what "serviceProxy" that can create
//default is class name
[HubName("hitCounter")]
public class HitcounterHub : Hub
{
    //holds the number of connected browsers
    private static int _hitCount;

    //server method that can be invoked by JavaScript
    public void RecordHit()
    {
        _hitCount += 1;
        //note... this is a dynamic method... think of the method as an event
        Clients.All.updateHitCount(_hitCount);
        //when this event fires on the server there is going to be a JavaScript 
        //event that will fire
        //NOTE:
        //- "All" means All callers will see the response
        //there are other more secure options here as well
    }

    //SignalR will communicate automatically when the browser is disconnected
    //For example, if close the browser window / tab, this will automatically
    //be called!
    public override Task OnDisconnected()
    {
        //decrease the counter
        _hitCount -= 1;
        //send a message back to all of the connected clients
        Clients.All.updateHitCount(_hitCount);
        return base.OnDisconnected();
    }
}
}