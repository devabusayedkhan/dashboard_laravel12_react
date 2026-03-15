<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function normalizeBDPhone(?string $phone): ?string
    {
        if (!$phone) return null;

        $p = preg_replace('/[^\d+]/', '', trim($phone));
        $digits = preg_replace('/\D/', '', $p);

        if (preg_match('/^01\d{9}$/', $digits)) return '+88' . $digits;
        if (preg_match('/^8801\d{9}$/', $digits)) return '+' . $digits;
        if (preg_match('/^008801\d{9}$/', $digits)) return '+880' . substr($digits, 4);

        return null;
    }

    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:100'],
                'phone' => ['required', 'string', 'max:30'],
                'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $normalizedPhone = $this->normalizeBDPhone($data['phone']);

            if (!$normalizedPhone) {
                throw ValidationException::withMessages([
                    'phone' => ['Invalid Bangladeshi phone number. Use 01XXXXXXXXX / +8801XXXXXXXXX / 8801XXXXXXXXX'],
                ]);
            }

            if (User::where('phone', $normalizedPhone)->exists()) {
                throw ValidationException::withMessages([
                    'phone' => ['This phone number is already registered.'],
                ]);
            }

            $user = User::create([
                'name' => $data['name'],
                'phone' => $normalizedPhone,
                'email' => $data['email'] ?? null,
                'password' => Hash::make($data['password']),
            ]);

            $user->syncRoles(['user']);

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'message' => 'Registered successfully',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            Log::error('Register DB error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Database error'], 500);
        } catch (\Throwable $e) {
            Log::error('Register error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'phone' => ['required', 'string'],
                'password' => ['required', 'string'],
            ]);

            $normalizedPhone = $this->normalizeBDPhone($data['phone']);

            if (!$normalizedPhone) {
                throw ValidationException::withMessages([
                    'phone' => ['Invalid Bangladeshi phone number.'],
                ]);
            }

            $user = User::where('phone', $normalizedPhone)->first();

            if (!$user || !Hash::check($data['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'phone' => ['Invalid phone or password'],
                ]);
            }

            if (!$user->is_active) {
                return response()->json(['message' => 'Account is inactive'], 403);
            }

            // optional: single-device login only
            $user->tokens()->delete();

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'message' => 'Logged in successfully',
                'token'   => $token,
                'user'    => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            Log::error('Login DB error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Database error'], 500);
        } catch (\Throwable $e) {
            Log::error('Login error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Me API error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            $currentToken = $user->currentAccessToken();

            if ($currentToken) {
                $currentToken->delete();
            }

            return response()->json(['message' => 'Logged out successfully'], 200);
        } catch (\Throwable $e) {
            Log::error('API Logout Error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to logout'], 500);
        }
    }
}
