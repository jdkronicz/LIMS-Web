﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;
using System.Linq.Expressions;

namespace Application.Repository
{
    public class SampleArchRepository : Repository<SampleArchive>, ISampleArchRepository
    {
        public SampleArchRepository(DbContext context)
            : base(context)
        {

        }

        public IList<SampleArchive> GetAll(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId, int currentPage, int pageCount, string sort, bool reverse)
        {
            var samples = _dbset.Include(x => x.Product).Include(x => x.WorkOrder).Include(z => z.RR_Reports.Select(x => x.RepResult.MethPara.Para)).Include(z => z.RR_Reports.Select(x => x.Report)).Where(s => s.WorkOrder.CustID == companyId)
                  .AsQueryable();
            samples = samples.Where(x => x.RR_Reports.Any(y => y.Report.Signed == true));
            if (product != null)
                samples = samples.Where(x => x.Product.ProdName.ToLower().Contains(product.ToLower()));
            if (subLotNumber != null)
                samples = samples.Where(x => x.LotNum.ToLower().Contains(subLotNumber.ToLower()) || x.SubLotNum.ToLower().Contains(subLotNumber.ToLower()));


            if (reportNumber != null)
                samples = samples.Where(x => x.RR_Reports.Any(y => y.Report.ReportNum.ToLower().Contains(reportNumber.ToLower())));
            if (receiptfromDT != null)
            {
                DateTime dt = Convert.ToDateTime(receiptfromDT);
                samples = samples.Where(x => x.WorkOrder.ReceiptDate >= dt);
            }
            if (receipttoDT != null)
            {
                DateTime dt = Convert.ToDateTime(receipttoDT);
                samples = samples.Where(x => x.WorkOrder.ReceiptDate <= dt);
            }
            Func<Sample, Object> orderByFunc = Item => Item.SampNum;
            return samples.OrderBy(x => x.SampDate).Skip(currentPage * pageCount).Take(pageCount).ToList();

        }
        public int GetCount(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId)
        {
            //return _dbset.Include(x=>x.Product).Include(x=>x.WorkOrder).Include(z=>z.Reports.Select(x=>x.RepResults)).ToList();
            //return _dbset.Include(x => x.Customer).Where(x => x.Email == userName && x.Password == password).FirstOrDefault();

            var samples = _dbset.Include(x => x.Product).Include(x => x.WorkOrder).Include(z => z.RR_Reports.Select(x => x.RepResult.MethPara.Para)).Include(z => z.RR_Reports.Select(x => x.Report)).Where(s => s.WorkOrder.CustID == companyId)
                 .AsQueryable();

            ////.Select(p=> new Sample { SampID=p.SampID,
            //     Product=p.Product,
            //     WorkOrder=p.WorkOrder,
            //     RR_Reports=p.RR_Reports.Select(s=> new RR_Report { RepResult=s.RepResult,
            //     Report=s.Report}).ToList()
            //     });
            samples = samples.Where(x => x.RR_Reports.Any(y => y.Report.Signed == true));
            if (product != null)
                samples = samples.Where(x => x.Product.ProdName.ToLower().Contains(product.ToLower()));
            if (subLotNumber != null)
                samples = samples.Where(x => x.LotNum.ToLower().Contains(subLotNumber.ToLower()) || x.SubLotNum.ToLower().Contains(subLotNumber.ToLower()));

            if (reportNumber != null)
                samples = samples.Where(x => x.RR_Reports.Any(y => y.Report.ReportNum.ToLower().Contains(reportNumber.ToLower())));

            if (receiptfromDT != null)
            {
                DateTime dt = Convert.ToDateTime(receiptfromDT);
                samples = samples.Where(x => x.WorkOrder.ReceiptDate >= dt);
            }
            if (receipttoDT != null)
            {
                DateTime dt = Convert.ToDateTime(receipttoDT);
                samples = samples.Where(x => x.WorkOrder.ReceiptDate <= dt);
            }
            return samples.Count();
        }
    }
}
