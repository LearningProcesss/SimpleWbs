using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using wbs_rest_aspnet.Application.Services.Interfaces;
using wbs_rest_aspnet.Application.Services.Dto;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.Persistence.Models;
using Moq;
using Microsoft.EntityFrameworkCore;

namespace wbs_app_unittest.Services;

[TestClass]
public class UserServiceUnitTest
{
    [TestMethod]
    public void First()
    {
        IEnumerable<UserDto> expectedUsersDto = new List<UserDto>();

        var mockSet = new Mock<DbSet<User>>();

        var mockContext = new Mock<WbsContext>();

        mockContext.Setup(m => m.Users).Returns(mockSet.Object);

        var serviceStub = new Mock<IUserService>();

        serviceStub.Setup(stub => stub.GetAll()).Returns(expectedUsersDto);

        IEnumerable<UserDto> stubbedResponse = serviceStub.Object.GetAll();
    }
}