cmake_minimum_required(VERSION 3.7)
project(12uren)

add_executable(12uren main.cpp util.h util.cpp token.cpp token.h user.cpp user.h)

find_package(ZLIB REQUIRED)
target_compile_options(12uren PRIVATE -DCROW_ENABLE_COMPRESSION)

FIND_PACKAGE( Boost REQUIRED )
set(BoostVersion "${Boost_MAJOR_VERSION}.${Boost_MINOR_VERSION}.${Boost_SUBMINOR_VERSION}")
message(STATUS "Boost version: ${BoostVersion}")
INCLUDE_DIRECTORIES( ${BOOST_INCLUDE_DIR} )
TARGET_LINK_LIBRARIES( 12uren PUBLIC ${BOOST_LIBRARIES} -lboost_system -lpthread -lcrypto -lcrypt -lz)