---
title: "Debug Macros"
date: 2023-09-24T16:19:14-04:00
draft: true
tags: ["debugging", "macros"]
categories: ["Unreal Engine"]
---

{{% pageinfo color="warning" %}}
Work in progress.
{{% /pageinfo %}}

Debug macros for Unreal Engine. Known to work in versions: 4.26 - 5.3

```cpp
#pragma once

#include "DrawDebugHelpers.h"


// Debug Shape Macros
#define DRAW_SPHERE(Location) if (GetWorld()) DrawDebugSphere(GetWorld(), Location, 25.f, 12, FColor::Red, true);
#define DRAW_SPHERE_COLOR(Location, Color) DrawDebugSphere(GetWorld(), Location, 8.f, 12, Color, false, 5.f);
#define DRAW_SPHERE_SINGLE_FRAME(Location) if (GetWorld()) DrawDebugSphere(GetWorld(), Location, 25.f, 12, FColor::Red, false, -1.f);
#define DRAW_LINE(StartLocation, EndLocation) if (GetWorld()) DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1.f, 0, 1.f);
#define DRAW_LINE_SINGLE_FRAME(StartLocation, EndLocation) if (GetWorld()) DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, false, -1.f, 0, 1.f);
#define DRAW_POINT(Location) if (GetWorld()) DrawDebugPoint(GetWorld(), Location, 15.f, FColor::Red, true);
#define DRAW_POINT_SINGLE_FRAME(Location) if (GetWorld()) DrawDebugPoint(GetWorld(), Location, 15.f, FColor::Red, false, -1.f);
#define DRAW_VECTOR(StartLocation, EndLocation) if (GetWorld()) \
	{ \
		DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1.f, 0, 1.f); \
		DrawDebugPoint(GetWorld(), EndLocation, 15.f, FColor::Red, true); \
	}
#define DRAW_VECTOR_SINGLE_FRAME(StartLocation, EndLocation) if (GetWorld()) \
	{ \
		DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, false, -1.f, 0, 1.f); \
		DrawDebugPoint(GetWorld(), EndLocation, 15.f, FColor::Red, false, -1.f); \
	}

// Log Macros
#define LOG_WARNING(Format, ...) UE_LOG(LogTemp, Warning, TEXT(Format), ##__VA_ARGS__)
#define LOG_ERROR(Format, ...) UE_LOG(LogTemp, Error, TEXT(Format), ##__VA_ARGS__)
#define LOG_DISPLAY(Format, ...) UE_LOG(LogTemp, Display, TEXT(Format), ##__VA_ARGS__)
#define LOG_VERBOSE(Format, ...) UE_LOG(LogTemp, Verbose, TEXT(Format), ##__VA_ARGS__)
#define LOG_FATAL(Format, ...) UE_LOG(LogTemp, Fatal, TEXT(Format), ##__VA_ARGS__)

// Screen Debug Macros
#define SCREEN_DEBUG_WARNING(Format,Key,Duration, ...) if (GEngine) GEngine->AddOnScreenDebugMessage(Key, Duration, FColor::Yellow, FString::Printf(TEXT(Format), ##__VA_ARGS__))
#define SCREEN_DEBUG_ERROR(Format,Key,Duration, ...) if (GEngine) GEngine->AddOnScreenDebugMessage(Key, Duration, FColor::Red, FString::Printf(TEXT(Format), ##__VA_ARGS__))
#define SCREEN_DEBUG_DISPLAY(Format,Key,Duration, ...) if (GEngine) GEngine->AddOnScreenDebugMessage(Key, Duration, FColor::White, FString::Printf(TEXT(Format), ##__VA_ARGS__))
#define SCREEN_DEBUG_VERBOSE(Format,Key,Duration, ...) if (GEngine) GEngine->AddOnScreenDebugMessage(Key, Duration, FColor::Green, FString::Printf(TEXT(Format), ##__VA_ARGS__))
#define SCREEN_DEBUG_FATAL(Format,Key,Duration, ...) if (GEngine) GEngine->AddOnScreenDebugMessage(Key, Duration, FColor::Black, FString::Printf(TEXT(Format), ##__VA_ARGS__))
#define SCREEN_DEBUG_CLEAR() if (GEngine) GEngine->ClearOnScreenDebugMessages()

// Log and Screen Debug Macros
#define LOG_SCREEN_DEBUG_WARNING(Format, ...) LOG_WARNING(Format, ##__VA_ARGS__); SCREEN_DEBUG_WARNING(Format,Key,Duration, ...)
#define LOG_SCREEN_DEBUG_ERROR(Format, ...) LOG_ERROR(Format, ##__VA_ARGS__); SCREEN_DEBUG_ERROR(Format,Key,Duration, ...)
#define LOG_SCREEN_DEBUG_DISPLAY(Format, ...) LOG_DISPLAY(Format, ##__VA_ARGS__); SCREEN_DEBUG_DISPLAY(Format,Key,Duration, ...) 
#define LOG_SCREEN_DEBUG_VERBOSE(Format, ...) LOG_VERBOSE(Format, ##__VA_ARGS__); SCREEN_DEBUG_VERBOSE(Format,Key,Duration, ...) 
#define LOG_SCREEN_DEBUG_FATAL(Format, ...) LOG_FATAL(Format, ##__VA_ARGS__); SCREEN_DEBUG_FATAL(Format,Key,Duration, ...) 
```