<%@ Page Language="C#" AutoEventWireup="true"  %>
<%@ Import namespace="System.Data.SqlClient"%>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <script language="c#" runat="server">

        public void Page_Load(object sender, EventArgs e)
        {
            using (SqlConnection connection =
                new SqlConnection("Data Source=remote.chemicalsolutionsltd.com;Initial Catalog=CS_LIMS;Persist Security Info=True;User ID=JD_Admin;Password=P@sSw0rd1364;MultipleActiveResultSets=True;"))
            {
                
               

                // Open the connection in a try/catch block. 
                // Create and execute the DataReader, writing the result
                // set to the console window.
                try
                {
                    connection.Open();
                    Response.Write("connected");

                }
                catch (Exception ex)
                {
                    Response.Write(ex.Message);
                }


            }
            //hello, world!
          
        }
</script>
    </div>
    </form>
</body>
</html>
