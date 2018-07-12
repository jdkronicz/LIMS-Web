using Application.DAL.Implementations;
using Application.Model;
using System;

namespace Application.DAL.Contracts
{
    public interface IDatabaseFactory : IDisposable
    {
        AdventureWorks Get();
    }
}
