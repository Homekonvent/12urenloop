cmake_minimum_required(VERSION 3.7)
project(wealth)

add_executable(wealth main.cpp util.h util.cpp token.cpp token.h user.cpp user.h fund.h fund.cpp collectible.h collectible.cpp stock.cpp stock.h)

find_package(ZLIB REQUIRED)
target_compile_options(wealth PRIVATE -DCROW_ENABLE_COMPRESSION)

FIND_PACKAGE( Boost REQUIRED )
set(BoostVersion "${Boost_MAJOR_VERSION}.${Boost_MINOR_VERSION}.${Boost_SUBMINOR_VERSION}")
message(STATUS "Boost version: ${BoostVersion}")
INCLUDE_DIRECTORIES( ${BOOST_INCLUDE_DIR} )
TARGET_LINK_LIBRARIES( wealth PUBLIC ${BOOST_LIBRARIES} -lboost_system -lpthread -lcrypto -lcrypt -lz)

TARGET_LINK_LIBRARIES(wealth PUBLIC mysqlclient -lmysqlcppconn)
INCLUDE_DIRECTORIES(/usr/include/mysql/)
LINK_DIRECTORIES(/usr/include/mysql/)
