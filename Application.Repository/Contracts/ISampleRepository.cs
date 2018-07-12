using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;

namespace Application.Repository
{
    public interface ISampleRepository : IRepository<Sample>
    {
        IList<Sample> GetAll(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId, int currentPage, int pageCount, string sort, bool reverse);
        int GetCount(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId);
        IList<Sample> GetWorkInProgress(int companyId, int currentPage, int pageCount, string sort, bool reverse);
        int GetWorkInProgress(int companyId);
    }
}
