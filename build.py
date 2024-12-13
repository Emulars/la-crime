import os
import shutil
import subprocess

def delete_folder(folder_path):
    """Deletes a folder if it exists."""
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
        print(f"Deleted folder: {folder_path}")
    else:
        print(f"Folder not found: {folder_path}")

def run_npm_build():
    """Runs the 'npm run build' command."""
    try:
        subprocess.run(['npm.cmd', 'run', 'build'], check=True)
        print("Build completed successfully.")
    except subprocess.CalledProcessError as e:
        print("Error running 'npm run build':", e)

def create_nojekyll_file(dist_folder):
    """Creates an empty .nojekyll file in the dist folder."""
    nojekyll_path = os.path.join(dist_folder, ".nojekyll")
    with open(nojekyll_path, 'w') as file:
        pass  # Just create an empty file
    print(".nojekyll file created in the dist folder.")

def rename_dist_to_docs(dist_folder):
    """Renames the dist folder to docs."""
    docs_folder = os.path.join(os.path.dirname(dist_folder), "docs")
    if os.path.exists(docs_folder):
        shutil.rmtree(docs_folder)  # Remove existing docs folder if it exists
    os.rename(dist_folder, docs_folder)
    print(f"Renamed '{dist_folder}' to '{docs_folder}'.")

def main():
    # Paths for dist and docs
    dist_folder = "dist"
    docs_folder = "docs"

    # Step 1: Delete "dist" and "docs" folder if they exist
    delete_folder(dist_folder)
    delete_folder(docs_folder)

    # Step 2: Run "npm run build"
    run_npm_build()

    # Step 3: Add ".nojekyll" file to the dist folder
    create_nojekyll_file(dist_folder)

    # Step 4: Rename the "dist" folder to "docs"
    rename_dist_to_docs(dist_folder)

if __name__ == "__main__":
    main()
