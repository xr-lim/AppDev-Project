<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    /**
     * Store a new report with image upload
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'user_email' => 'required|email',
            'type' => 'required|in:traffic,suspicious',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');

                // Generate unique filename
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                // Store in public/storage/reports directory
                $path = $image->storeAs('reports', $filename, 'public');

                // Create the report record
                $report = Report::create([
                    'user_email' => $request->user_email,
                    'type' => $request->type,
                    'description' => $request->description,
                    'location' => $request->location,
                    'image_path' => $path,
                    'status' => 'pending',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Report submitted successfully',
                    'data' => [
                        'report_id' => $report->id,
                        'image_url' => asset('storage/' . $path),
                        'status' => $report->status,
                    ]
                ], 201);
            }

            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all reports
     */
    public function index()
    {
        try {
            $reports = Report::orderBy('created_at', 'desc')->get();

            // Add full image URL to each report
            $reports->transform(function ($report) {
                $report->image_url = asset('storage/' . $report->image_path);
                return $report;
            });

            return response()->json([
                'success' => true,
                'data' => $reports
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific report
     */
    public function show($id)
    {
        try {
            $report = Report::findOrFail($id);
            $report->image_url = asset('storage/' . $report->image_path);

            return response()->json([
                'success' => true,
                'data' => $report
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Report not found'
            ], 404);
        }
    }

    /**
     * Update report status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,reviewed,resolved',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $report = Report::findOrFail($id);
            $report->status = $request->status;
            $report->save();

            return response()->json([
                'success' => true,
                'message' => 'Report status updated successfully',
                'data' => $report
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update report status'
            ], 500);
        }
    }

    /**
     * Delete a report
     */
    public function destroy($id)
    {
        try {
            $report = Report::findOrFail($id);

            // Delete the image file
            if (Storage::disk('public')->exists($report->image_path)) {
                Storage::disk('public')->delete($report->image_path);
            }

            $report->delete();

            return response()->json([
                'success' => true,
                'message' => 'Report deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete report'
            ], 500);
        }
    }
}
