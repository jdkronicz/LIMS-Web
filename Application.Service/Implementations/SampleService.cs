
using Application.Repository.Common;
using Application.Model;
using System;

using Application.Service.Common;
using System.Collections.Generic;
using System.Linq;
using Application.Repository;

namespace Application.Service
{
    public class SampleService : EntityService<Sample>, ISampleService
    {
        IUnitOfWork _unitOfWork;
        ISampleRepository _sampleRepository;
        ISampleArchRepository _sampleArchRepository;

        public SampleService(ISampleRepository sampleRepository,ISampleArchRepository sampleArchRepository)
            : base(sampleRepository)
        {
            // _unitOfWork = unitOfWork;
            _sampleRepository = sampleRepository;
            _sampleArchRepository = sampleArchRepository;
        }


        public Sample GetById(long Id)
        {
            return _sampleRepository.FindBy(x => x.SampID == Id).FirstOrDefault();
        }


        public int GetCount(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId)
        {
            int count = _sampleRepository.GetCount(reportNumber, product, subLotNumber, receiptfromDT, receipttoDT, companyId) + _sampleArchRepository.GetCount(reportNumber, product, subLotNumber, receiptfromDT, receipttoDT, companyId);
            return count;// FindBy(x => x.sampleID == Id).FirstOrDefault();
        }
        public IList<Sample> GetAll(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId, int currentPage, int pageCount, string sort, bool reverse)
        {
            List<Sample> sample= _sampleRepository.GetAll(reportNumber, product, subLotNumber, receiptfromDT, receipttoDT, companyId,currentPage, pageCount, sort, reverse).ToList();// FindBy(x => x.sampleID == Id).FirstOrDefault();
            sample = sample.Select(m => new Sample
            {
                SampNum = m.SampNum,
                LotNum = m.LotNum,
                Product = m.Product,
                SubLotNum = m.SubLotNum,
                WorkOrder = m.WorkOrder,
                SampID = m.SampID,
                
                Reportnews = m != null ? (m.RR_Reports.GroupBy(x => x.Report).Select(g => new Report
                {
                    ReportNum = g.Key.ReportNum != null ? g.Key.ReportNum : null,
                    ReportType="report",
                    // ReportFile=g.Key.ReportFile,
                    ReportID = g.Key.ReportID,
                    RepResults = m.RR_Reports.Where(v => v.ReportID == g.Key.ReportID).Select(n => n.RepResult).ToList()
                    
                }).ToList()) : null
            }).ToList();
            int samplecount = sample.Count;
             if (samplecount < pageCount)
            {
                int count = _sampleRepository.GetCount(reportNumber, product, subLotNumber, receiptfromDT, receipttoDT, companyId);


                currentPage = Math.Abs( (int) (Math.Ceiling(((double)((10 - count % 10) + count))/ pageCount)- (currentPage+1)));
                pageCount = pageCount - samplecount;
                if (currentPage < 0) currentPage = 0;
               IList<SampleArchive> sampleArch1 = _sampleArchRepository.GetAll(reportNumber, product, subLotNumber, receiptfromDT, receipttoDT, companyId, currentPage, pageCount, sort, reverse).ToList();// FindBy(x => x.sampleID == Id).FirstOrDefault();

                IList<Sample> sample3 = sampleArch1.Select(m => new Sample
                {
                    SampNum = m.SampNum,
                    LotNum = m.LotNum,
                    Product = m.Product,
                    SubLotNum = m.SubLotNum,
                    WorkOrder = new WorkOrder {WO_ID= m.WorkOrder.WO_ID,WO_Num=m.WorkOrder.WO_Num,ReceiptDate=m.WorkOrder.ReceiptDate },
                    SampID = m.SampID,

                    Reportnews = m != null ? (m.RR_Reports.GroupBy(x => x.Report).Select(g => new Report
                    {
                        ReportNum = g.Key.ReportNum != null ? g.Key.ReportNum : null,
                        ReportType = "archive",
                        // ReportFile=g.Key.ReportFile,
                        ReportID = g.Key.ReportID,
                        RepResults = m.RR_Reports.Where(v => v.ReportID == g.Key.ReportID).Select(n => n.RepResult).Select(x=> new RepResult { RR_ID=x.RR_ID,MethPara=x.MethPara}).ToList()

                    }).ToList()) : null
                }).ToList();
                var sample2 = sample.Concat(sample3);
                return sample2.ToList();
            }

            return sample;
        }



        public IList<Sample> GetWorkInProgress(int companyId, int currentPage, int pageCount, string sort, bool reverse)
        {
           
            return _sampleRepository.GetWorkInProgress(companyId, currentPage, pageCount, sort, reverse);


        }


        public int GetWorkInProgress(int companyId)
        {

            return _sampleRepository.GetWorkInProgress(companyId);


        }
    }
}
