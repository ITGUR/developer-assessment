using Xunit;
using TodoList.Api.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http.Json;

namespace TodoList.Api.UnitTests
{
    public class TodoItemsControllerTests
    {
        private static HttpClient sharedClient = new()
        {
            BaseAddress = new Uri("http://localhost:5000/"),
        };

        [Theory]
        [InlineData("272f5c26-a6df-4565-8ae3-758b1d52707a", "Task 1")]
        [InlineData("17527198-c3cc-4417-a919-2d8d64481ddd", "Task 2")]
        [InlineData("0c53f026-a872-47d0-82ee-936988cbae6c", "Task 3")]
        static async void Test100_PostTodoItems(Guid guid,string description)
        {
            var item = new TodoItem { Id = guid, Description = description,IsCompleted=false };
            using HttpResponseMessage response = await sharedClient.PostAsJsonAsync("api/todoitems/",item);

            response.EnsureSuccessStatusCode();
        }

        [Theory]
        [InlineData("272f5c26-a6df-4565-8ae3-758b1d52707a", "Task 1")]
        [InlineData("17527198-c3cc-4417-a919-2d8d64481ddd", "Task 2")]
        [InlineData("0c53f026-a872-47d0-82ee-936988cbae6c", "Task 3")]
        static async void Test110_PostTodoItems_DuplicateDescription(Guid guid, string description)
        {
            var item = new TodoItem { Id = guid, Description = description, IsCompleted = false };
            using HttpResponseMessage response = await sharedClient.PostAsJsonAsync("api/todoitems/", item);

            Assert.Equal("BadRequest", response.StatusCode.ToString());
        }

        [Fact]
        static async void Test200_GetAllTodoItems()
        {
            using HttpResponseMessage response = await sharedClient.GetAsync("api/todoitems/");

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var list = JsonConvert.DeserializeObject<List<TodoItem>>(json);
            Assert.NotNull(list);

        }

        [Theory]
        [InlineData("272f5c26-a6df-4565-8ae3-758b1d52707a")]
        [InlineData("17527198-c3cc-4417-a919-2d8d64481ddd")]
        [InlineData("0c53f026-a872-47d0-82ee-936988cbae6c")]
        static async void Test201_GetOneTodoItem(Guid guid)
        {
            using HttpResponseMessage response = await sharedClient.GetAsync("api/todoitems/"+guid);
            response.EnsureSuccessStatusCode();

            var item = await response.Content.ReadFromJsonAsync<TodoItem>();
            
            Assert.NotNull(item);

            Assert.Equal(guid, item.Id);
        }

        [Theory]
        [InlineData("272f5c26-a6df-4565-8ae3-758b1d52707a", "Task 1")]
        [InlineData("17527198-c3cc-4417-a919-2d8d64481ddd", "Task 2")]
        [InlineData("0c53f026-a872-47d0-82ee-936988cbae6c", "Task 3")]
        static async void Test301_MarkAsCompleted(Guid guid, string description)
        {
            var item = new TodoItem { Id = guid, Description = description, IsCompleted = true };

            using HttpResponseMessage response = await sharedClient.PutAsJsonAsync("api/todoitems/" + guid, item);
            var data = await response.Content.ReadAsStringAsync();
            Assert.Equal("NoContent", response.StatusCode.ToString());

        }

        /* Example 
        [Theory]
        [InlineData(5,6,11)]
        [InlineData(4, 6, 10)]
        [InlineData(5, 7, 12)]
        public void Test_Should_TestSomething(int x,int y, int expected)
        {
            int actual = x + y;
            Assert.Equal(expected, actual);
        }
        */
    }
}
