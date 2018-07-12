using Application.Model;
using System.Collections.Generic;

namespace Application.Service
{
    public interface ISampleService
    {
        Sample GetById(long Id);
        IList<Sample> GetAll(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId, int currentPage, int pageCount, string sort, bool reverse);
        int GetCount(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT, int companyId);
        IList<Sample> GetWorkInProgress(int companyId, int currentPage, int pageCount, string sort, bool reverse);
        int GetWorkInProgress(int companyId);


    }
}
