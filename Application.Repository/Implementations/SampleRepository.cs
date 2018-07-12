using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;

namespace Application.Repository
{
    public class SampleRepository : Repository<Sample>, ISampleRepository
    {
        public SampleRepository(DbContext context)
            : base(context)
        {

        }

        public IList<Sample> GetAll(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId,int currentPage, int pageCount, string sort, bool reverse)
        {

            var samples = _dbset.Include(x => x.Product).Include(x => x.WorkOrder).Include(z => z.RR_Reports.Select(x => x.RepResult.MethPara.Para)).Include(z => z.RR_Reports.Select(x => x.Report)).Where(s => s.WorkOrder.CustID == companyId)
                 .AsQueryable();
            samples = samples.Where(x => x.RR_Reports.Any(y => y.Report.Sent == true));
            if (product != null)
                samples = samples.Where(x => x.Product.ProdName.ToLower().Contains(product.ToLower()));
            // if (subLotNumber != null)
            //   samples = samples.Where(x => x.SubLotNum.ToLower().Contains(subLotNumber.ToLower()));
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
            // return samples.ToList();
        }


        public IList<Sample> GetWorkInProgress(int companyId, int currentPage, int pageCount, string sort, bool reverse)
        {
            //return _dbset.Include(x=>x.Product).Include(x=>x.WorkOrder).Include(z=>z.Reports.Select(x=>x.RepResults)).ToList();
            //return _dbset.Include(x => x.Customer).Where(x => x.Email == userName && x.Password == password).FirstOrDefault();

            return _dbset.Include(x => x.SampMethParas.Select(y=>y.Status)).Include(x => x.SampMethParas.Select(y => y.Para)).Include(x => x.Status).Include(x => x.Product).Include(x => x.WorkOrder.Matrix).Where(x=>x.WorkOrder.CustID==companyId).OrderBy(x => x.SampID).Skip(currentPage * pageCount).Take(pageCount).ToList();

            
            // return samples.ToList();
        }
        public int GetWorkInProgress(int companyId)
        {
            //return _dbset.Include(x=>x.Product).Include(x=>x.WorkOrder).Include(z=>z.Reports.Select(x=>x.RepResults)).ToList();
            //return _dbset.Include(x => x.Customer).Where(x => x.Email == userName && x.Password == password).FirstOrDefault();

            return _dbset.Include(x => x.WorkOrder).Where(x => x.WorkOrder.CustID == companyId).Count();


            // return samples.ToList();
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
