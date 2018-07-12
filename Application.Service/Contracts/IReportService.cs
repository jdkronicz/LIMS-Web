using Application.Model;
using System.Collections.Generic;

namespace Application.Service
{
    public interface IReportService
    {
        byte[] GetById(Report report);

    }
}
