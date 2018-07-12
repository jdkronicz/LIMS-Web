using System;

using System.Net;

using System.Net.Http;

using System.Threading;

using System.Threading.Tasks;

using System.Web;

using System.Web.Http;

using System.Web.Http.ExceptionHandling;







public class GlobalExceptionHandler : ExceptionHandler

{

    public override void Handle(ExceptionHandlerContext context)

    {

        var exception = context.Exception;

        var httpexception = exception as HttpException;







        if (httpexception != null)

        {

            //Log Error in Elms

            //ExceptionCatch.LogError(httpexception);

            context.Result = new SimpleErrorResult(context.Request, (HttpStatusCode)httpexception.GetHttpCode(), httpexception.Message);

            return;

        }

        if (exception is RootobjectNotFoundException)

        {

            //Log Error in Elms

            //ExceptionCatch.LogError(httpexception);

            context.Result = new SimpleErrorResult(context.Request, HttpStatusCode.NotFound, httpexception.Message);

            return;




        }

        if (exception is ChildobjectNotFoundException)

        {

            //Log Error in Elms

           // ExceptionCatch.LogError(httpexception);

            context.Result = new SimpleErrorResult(context.Request, HttpStatusCode.Conflict, httpexception.Message);

            return;




        }







        if (exception != null && exception.GetBaseException() != null)

        {

            var baseException = exception.GetBaseException();

            //Log Error in Elms

            //ExceptionCatch.LogError(baseException);

            HttpRequestMessage a = new HttpRequestMessage();

            context.Result = new SimpleErrorResult(a, HttpStatusCode.InternalServerError, baseException.Message);

            return;




        }

        //Log Error in Elms

        //ExceptionCatch.LogError(exception);




        context.Result = new SimpleErrorResult(context.Request, HttpStatusCode.InternalServerError, exception.Message);










    }

}




public class SimpleErrorResult : IHttpActionResult

{

    private readonly string _errorMessage;

    private readonly HttpRequestMessage _requestMessage;

    private readonly HttpStatusCode _statusCode;

    public SimpleErrorResult(HttpRequestMessage requestMessage, HttpStatusCode statusCode, string errorMessage)

    {

        _errorMessage = errorMessage;

        _requestMessage = requestMessage;

        _statusCode = statusCode;

    }




    public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)

    {




        return Task.FromResult(_requestMessage.CreateErrorResponse(_statusCode, _errorMessage));

    }

}

[Serializable]

public class RootobjectNotFoundException : Exception

{

    public RootobjectNotFoundException(string message)

        : base(message)

    {

    }

}




[Serializable]

public class ChildobjectNotFoundException : Exception

{

    public ChildobjectNotFoundException(string message)

        : base(message)

    {

    }

}