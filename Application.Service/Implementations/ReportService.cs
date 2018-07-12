
using Application.Repository.Common;
using Application.Model;


using Application.Service.Common;
using System.Collections.Generic;
using System.Linq;
using Application.Repository;

namespace Application.Service
{
    public class ReportsService : EntityService<Report>, IReportService
    {
        IUnitOfWork _unitOfWork;
        IReportRepository _reportRepository;
        IReportArchRepository _reportArchRepository;
        public ReportsService(IReportRepository reportRepository, IReportArchRepository reportArchRepository)
            : base(reportRepository)
        {
            // _unitOfWork = unitOfWork;
            _reportRepository = reportRepository;
            _reportArchRepository = reportArchRepository;
        }


        public byte[] GetById(Report report)
        {
            byte[] reportFile = null;
            if (report.ReportType == "report")
            {
                Report reportnew= _reportRepository.FindBy(x => x.ReportID == report.ReportID).FirstOrDefault();
                reportFile = reportnew.ReportFile;
            }
            else
            {
                ReportArchive reportnew = _reportArchRepository.FindBy(x => x.ReportID == report.ReportID).FirstOrDefault();
                reportFile = reportnew.Report;
            }

            return reportFile;
        }

     
    }
}
