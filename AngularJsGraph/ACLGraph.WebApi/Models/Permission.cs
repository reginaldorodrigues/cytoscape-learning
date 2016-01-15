using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ACLGraph.WebApi.Models
{
    public class Permission
    {
        public Resource Resource { get; set; }

        public Action Action { get; set; }
    }
}